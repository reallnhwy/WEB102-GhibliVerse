import React from 'react';
import './CreatePost.css'
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import Nav from '../components/navbar';
import { useState } from 'react';

const CreatePost = () => {
    const [post, setPost] = useState({title: "", content: "", url: "", votes: 0})
    
    const handleChange = (event) => {
        const {name, value} = event.target
        setPost((prev) => {
            return{
                ...prev, [name]: value,
            }
        })
    }

    const createPost = async (event) => {
        event.preventDefault()

        await supabase
        .from('GhibliPost')
        .insert({title: post.title, content: post.content, url: post.url})
        .select()

        window.location = "/"
    }
    
    return (
        <div className='CreatePost'>
            <Nav/>
            <h2>Create Your Post:</h2>
            <form>
                <label for="title">Title</label> <br />
                <input type="text" id="title" name="title" onChange={handleChange} /><br />
                <br/>

                <label for="content">Content</label><br />
                <input type="text" id="content" name="content" onChange={handleChange} placeholder='optional'/><br />
                <br/>

                <label for="url">Image URL</label><br />
                <input type="text" id="url" name="url" onChange={handleChange} placeholder='optional'/><br />
                <br/>
                
                <br/>
                <button onClick={createPost}>Submit</button> 
            </form>
        </div>
    )
}

export default CreatePost