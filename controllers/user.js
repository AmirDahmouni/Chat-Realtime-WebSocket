const User=require("../models/User");
const Conversation=require("../models/Conversation")
const bcrypt = require("bcrypt");
const cloudinary = require('../middlewares/cloudinary')


exports.uploadImage = async (req, res, next) => {
  if (req.files.profileImage) 
  {
      cloudinary.uploader.upload_large(req.files.profileImage.tempFilePath, { resource_type: 'image' },
       async (err, result) => {
          req.body.secure_url = result.secure_url;
          return next()
      })
  } 
  else {
      return res.status(500).send({error:"error"})
  }
}

exports.updateImage = async (req, res, next) => {
  if (req.files.profileImage) 
  {
      cloudinary.uploader.upload_large(req.files.profileImage.tempFilePath, { resource_type: 'image' },
       async (err, result) => {
          
          await User.findByIdAndUpdate(req.user._id,{profilePicture:result.secure_url})
          res.status(200).send(result.secure_url)
      })
  } 
  else {
      return res.status(500).send({error:"error"})
  }
}

exports.register= async (req, res) => {
    
    try{
    const user = await User.findOne({ username: req.body.username }).exec()
    if (user) return res.status(409).json({ message: 'username already taken' })
    const hashedpw = await bcrypt.hash(req.body.password, 11)
    const newuser = new User({
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            password: hashedpw,
            joinDate: new Date().toISOString(),
            address: req.body.address,
            profilePicture: req.body.secure_url,
            tel: req.body.phone
    })
    await newuser.save()
    
    let friends=await User.find({_id: { $ne: newuser._id}});
    friends.map( async (friend)=>{
      let newConversation = new Conversation({users: [friend._id, newuser._id]});
      let savedConversation = await newConversation.save();
      await User.findByIdAndUpdate(newuser._id,{$push: { conversations:savedConversation._id }})
      await User.findByIdAndUpdate(friend._id,{$push: { conversations: savedConversation._id }})
    })
    
    return res.status(200).json({ message: 'user successfully created' })  
    }
    catch(error)
    {
    console.log(error.meesage)
    }
}

exports.login=async (req, res) => {
    
    try {
      let user = await User.findOne({ username: req.body.username });
      if(!user) return res.status(404).json("user not found");
  
      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if(!validPassword) return res.status(400).json("wrong password")
      
      await User.findByIdAndUpdate(user._id,{$set: 
                 { connection :{status: true, lastVisit: "" } } })
                
      user=await User.findById(user._id)
      
      user={...user._doc,token:user.generateAuth()}
      
      return res.status(200).json(user)
    } catch (err) {
      return res.status(500).json(err)
    }
}

exports.logout=async(req,res)=>{
  try {
    const lastVisitDate = new Date().toISOString()
    let user=await User.findByIdAndUpdate(req.user._id,{$set: 
               { connection : {status: false, lastVisit:lastVisitDate }  } })
    
    user=await User.findById(req.user._id)
    if(!user) return res.status(404).json("not found")
    return res.status(200).json(user)
  }
  catch (err) {
    return res.status(500).json(err)
  }
}

exports.update=async(req,res)=>{
  
  try{
     let user=await User.findById(req.user._id)
     
     let data={
       username: req.body.username ||user.username,
       name: req.body.name || user.name,
       surname:req.body.surname || user.surname,
       tel:req.body.tel || user.tel,
       address:req.body.address || user.address,
     }
     if(req.body.oldpassword && req.body.newpassword)
     {
      const validPassword = await bcrypt.compare(req.body.oldpassword, user.password)
      if(validPassword) 
      {
        const hashedpw = await bcrypt.hash(req.body.newpassword, 11)
        data={...data,password:hashedpw}
      }
     }
     await User.findByIdAndUpdate(req.user._id,data)

    }
  catch(err)
  {
    console.log(err.message)
  }
}

exports.delete=async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) 
    {
      try 
      {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("Account has been deleted");
      } 
      catch (err) { return res.status(500).json(err);}
    } 
    else {
      return res.status(403).json("You can delete only your account!");
    }
}

exports.getById=async (req, res) => {
   let userId=req.query.userId;
    try {
      const user = userId ? await User.findById(req.query.userId): 
                            await User.findOne({ username: req.query.username });
      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json(other);
    } catch (err) {
      return res.status(500).json(err);
    }
}

exports.findConversationByUser=async(req,res)=>{
  try {

    var usersIds=await User.find({ username: { $regex: req.body.keywords, $options: 'i'} }).select("_id")
    usersIds=usersIds.map(user=> user._id.toString() )

    if(usersIds.length===0) return res.status(200).json([])
    
    let userconversations=await User.findById(req.user._id).populate(
      {
        path : 'conversations',
        populate : {
          path : 'messages'
        }
      }
    ).populate({
      path:"conversations",
      populate:{
        path:"users"
      }
    }).select("conversations")
    
    
    let conversations=userconversations.conversations.filter(conversation=> 
      conversation.users.some(user=> usersIds.includes(user._id.toString())) )
   
    return res.status(200).json(conversations)
  } catch (err) {
    return res.status(500).json(err);
  }
}

exports.getConversationsOnline=async(req,res)=>{
  
  try{
    let user=await User.findById(req.user._id).populate({
      path : 'conversations',
      populate : {
        path : 'messages'
      }
    })
    
    
    let conversations=user.conversations.filter(
            conversation=>!conversation.users.some(user=>req.body.onlineUsers.includes(user)))
            
    if(conversations.length>0) return res.status(200).json(conversations)
    else return res.status(404).json("no conversation found")
  }
  catch(err)
  {
    console.log(err)
  }
}

exports.getAllConversations=async(req,res)=>{
  try{
    let user=await User.findById(req.user._id).populate({
      path : 'conversations',
      populate : {
        path : 'messages',
      }
    }).populate({
      path : 'conversations',
      populate : {
        path : 'users',
      }
    }).select("conversations")
    
  
    if(user) return res.status(200).json(user.conversations)
    else return res.status(404).json("no conversation found")
  }
  catch(err)
  {
    console.log(err)
  }
}