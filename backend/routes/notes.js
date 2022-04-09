const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const {body, validationResult}  = require('express-validator');


router.get('/fetchallnotes', fetchuser, async(req,res)=>{
    try{
const notes = await Note.find({user:req.user.id});
    res.json(notes)
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})


router.post('/addnote', fetchuser,[
    body('title','enter valid title').isLength({min:5}),
    body('descrption','eneter valid des').isLength({min:5})

], async(req,res)=>{
    // let success = false;
    try{
    const {id,title, description, tag} = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
      }
      const note =new Note({
title, description, tag, user:req.user.id
      })
const saveNote = await note.save()
        res.json( saveNote)
    }
    catch(error)
    {
      console.error(error.message);
      res.status(500).send("some error occurred");
    }
    })
    router.delete('/deletenote/:id', fetchuser, async (req, res) => {
        try {
            
            let note = await Note.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }
    
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed");
            }
    
            note = await Note.findByIdAndDelete(req.params.id)
            res.json({ "Success": "Note has been deleted", note: note });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

   
router.put('/updatenote/:id', fetchuser, async(req,res)=>{
   const {title, description ,tag} = req.body;
   try{
   const newNote = {};
    if(title){
        newNote.title  =title;
    }
    if(description){
        newNote.description  =description;
    }
    if(tag){
        newNote.tag  = tag;
    }
let note = await Note.findById(req.params.id);
if(!note)
{
    return res.status(404).send("not found");

}
if(note.user.toString() !==req.user.id){
return res.status(401).send("not allowed");

}
note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})
res.json({note});
   }
   catch(error)
   {
    console.error(error.message);
    res.status(500).send("some error occurred"); 
   }
    })
   


   
module.exports = router;