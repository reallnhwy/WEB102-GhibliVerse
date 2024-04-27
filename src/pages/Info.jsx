import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../client";
import './Info.css'
import Nav from "../components/navbar";

const Info = () => {
    const { id } = useParams();
    const [info, setInfo] = useState({title: "", content: "", url: "", votes: 0});
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    function formatDateTime(dateTimeString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleString('en-US', options);
    }

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmitComment = async (event) => {
        event.preventDefault();
        try {
            await supabase
                .from("comments")
                .insert([{ content: comment, id_fk: id}]);
            // After submitting the comment, refetch the comments to display the updated list
            fetchComments();
            // Clear the comment input field
            setComment("");
        } catch (error) {
            console.error("Error submitting comment:", error.message);
        }
    };

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from("comments")
                .select("*")
                .eq("id_fk", id);
            if (error) {
                throw error;
            }
            setComments(data || []);
        } catch (error) {
            console.error("Error fetching comments:", error.message);
        }
    };

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const { data, error } = await supabase
                    .from("GhibliPost")
                    .select("*")
                    .eq("id", id)
                    .single();
                if (error) {
                    throw error;
                }
                if (data) {
                    setInfo(data);
                }
            } catch (error) {
                console.error("Error fetching info:", error.message);
            }
        };
        fetchInfo();
        fetchComments(); // Fetch comments when the component mounts
    }, [id]);

    return (
        <div className="Info">
            <Nav/>
            {info ? (
                <>
                    <h3>{info.title}</h3>
                    <p className="time">{formatDateTime(info.created_at)}</p>
                    <p>{info.content}</p>
                    <div className="img-container">
                        <img src={info.url} alt="Post"></img>
                    </div>
                    <h4>Comments: </h4>
                    <div className="comment-form">
                        <input
                            type="text"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Leave a comment..."
                            required
                        />
                        <button type="submit" onClick={handleSubmitComment}>Submit</button>
                    </div>
                    <div className="comments">
                        {comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p>- {comment.content}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Info;
