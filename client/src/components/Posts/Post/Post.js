import React , {useState} from "react";
import {
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    CardMedia,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";
import moment from "moment";

import NoPost from "../../../images/NoPost.png";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../actions/posts";
import useStyles from "./styles";

const Post = ({ post, setCurrentId }) => {
    const dispatch = useDispatch();
    const [likes , setLikes] = useState(post?.likes);
    const classes = useStyles();

    const user = JSON.parse(localStorage.getItem("profile"));
    
  const userId = user?.result?._id;
    const hasLikedPost = post.likes.find((like) => like === userId);

    const handleLike = async () => {
        dispatch(likePost(post._id));
    
        if (hasLikedPost) {
          setLikes(post.likes.filter((id) => id !== userId));
        } else {
          setLikes([...post.likes, userId]);
        }
      };
    


   
      const Likes = () => {
        if (likes?.length > 0) {
          return likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
            ? (
              <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
            ) : (
              <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }
    
        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
      };

    return (
        <Card className={classes.card}  >
            <CardMedia
                className={classes.media}
                image={post.selectedFile || NoPost}
                title={post.title}
            />
            <div className={classes.overlay}>
                <Typography variant="h6">{post.name}</Typography>
                <Typography variant="body2">
                    {moment(post.createdAt).fromNow()}
                </Typography>
            </div>
            {(user?.result?._id === post?.creator) && (
                <div className={classes.overlay2} name="edit">
                    <Button
                        onClick={(e) => { 
                            e.stopPropagation();
                            setCurrentId(post._id)}}
                        style={{ color: "white" }}
                        size="small">
                        <MoreHorizIcon fontSize="medium" />
                    </Button>
                </div>
            )}
            <div className={classes.details}>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="h2">
                    {post.tags.map((tag) => `#${tag} `)}
                </Typography>
            </div>
            <Typography
                className={classes.title}
                variant="h5"
                gutterBottom
                component="h2">
                {post.title}
            </Typography>
            <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
            <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
                <Likes />
            </Button>

               {( user?.result?._id === post?.creator) && (<Button
                    size="small"
                    color="primary"
                    onClick={() => {
                        dispatch(deletePost(post._id));
                    }}>
                    <DeleteIcon fontSize="small" />
                    &nbsp;Delete
                </Button>)}
            </CardActions>
        </Card>
    );
};

export default Post;
