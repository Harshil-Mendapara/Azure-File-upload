const Post = require('../model/post.model');
const { uploadImage, getImageData } = require('../services/Azure-fileupload');

const createPost = async (req, res) => {
    const { userId } = req.user;
    const { title, description } = req.body

    const file = req.file;
    // console.log('file', file)

    if (!file) {
        return res.status(400).send({
            success: false,
            message: 'No file uploaded.'
        });
    }


    try {
        const result = await uploadImage(file);
        // console.log('result', result)

        const newPost = new Post({
            title,
            description,
            post: result?.image,
            userId
        });

        await newPost.save();

        if (!newPost) {
            return res.status(404).json({
                success: true,
                message: 'Post not created',
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Post Created Successfully',
            Post: newPost,
        });

    } catch (error) {
        console.log('error', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

const showPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log('post', post)
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Extract the image blob name from the URL stored in the post
        const blobName = post.post.split('/').pop(); 
        
        const result = await getImageData(blobName);

        if (result.status) {
            const base64String = Buffer.from(result.image).toString("base64");
            const imageSrc = `data:image/;base64,${base64String}`;

            return res.render('post', {
                post: {
                    title: post.title,
                    description: post.description,
                    imageSrc: imageSrc
                }
            });

            // return res.status(200).json({
            //     success: true,
            //     imageSrc: imageSrc,
            //     title: post.title,
            //     description: post.description
            // });
            
        } else {
            return res.status(500).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error retrieving post:', error);
        res.status(500).send('Error retrieving post');
    }
};


module.exports = {
    createPost,
    showPost
}



