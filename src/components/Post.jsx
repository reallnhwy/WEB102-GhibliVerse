import React from 'react';
import { useState } from 'react';
import './Post.css';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const Post = (props) => {

    const [votes, setVotes] = useState(props.votes || 0);

    const handleVote = async () => {
        try {
            // Increment the local votes count
            setVotes(votes + 1);
            
            // Update the votes count in the database
            const { error } = await supabase
                .from('GhibliPost')
                .update({ votes: votes + 1 })
                .eq('id', props.id);
            
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating votes:', error.message);
        }
    };

    return (
        <div className='Post'>
            <div className='post-header'>
                <div className="title-container">
                    <h2>{props.title}</h2>
                </div>
                <div className="info-link">
                    <Link to={"/info/" + props.id}><img src='../src/images/more.png'></img></Link>
                </div>
            </div>
            <p className='time'>{props.time}</p>
            <p>{props.content}</p>
            <div className="ImageContainer">
                <img src={props.url} alt="Post Image" className="PostImage" />
            </div>
            <div className='post-footer'>
                <div className="VoteSection">
                    <img src='../src/images/img1.png' onClick={handleVote}></img>
                    <span>Votes: {props.votes}</span>
                </div>
                <Link to={"/edit/" + props.id}><button>Edit Post</button></Link>
            </div>
           
        </div>
    );
}

export default Post;
