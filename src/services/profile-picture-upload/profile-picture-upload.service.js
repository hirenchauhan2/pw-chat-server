const cloudinary = require('cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const hooks = require('./hooks');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, 'image_' + Math.random()+ '_' + path.extname(file.originalname))
  }
});

const upload = multer({ storage }).single('image')

// Initializes the `messages` service on path `/upload`
module.exports = function () {
  const app = this;
  const cldConfig = app.get('authentication').cloudinary
  cloudinary.config(cldConfig);

  class MyProfilePicUploadService {
    setup(app) {
      this.app = app
    }

    create(data, params) {
      const userId = params.user.id;
      const userService = app.service('users');

      return new Promise(async (resolve, reject) => {
        const filePath = params.file.path;

        const options = {
          public_id: `${userId}_${params.user.firstName}_${params.user.lastName}`,
          async: true,
          folder: 'pwc_app/users/profile_pictures'
        };

        return cloudinary.v2.uploader.upload(filePath, options, async (error, result) => {
          if (error) {
            console.log('error in uploading to  cloudinary', error)
            return reject(error)
          }

          try {
            const update = await userService.patch(userId, {
              profilePicture: result.url
            }, {});

            if (update) {
              // File is uploaded to server and user is patched
              // now we can delete the file from heroku server
              fs.unlink(filePath, (err)=> {
                if (err) {
                  console.log('Error while deleting the file ' + filePath)
                }
              });
              return resolve({
                data: result.url
              })
            } else {
              console.log('user not found')
              return reject(new Error('User Not found'))
            }
          } catch (err) {
            console.log('Humm error', err)
            return reject(err)
          }
        });
      });
    }
  };

  // Initialize our service with any options it requires
  app.use('/upload',
    function(req, res, next) {
      if(req.method.toLowerCase() === 'post') {
        return upload(req, res, next);
      }
      next();
    },
    function(req, res, next) {
      req.feathers.file = req.file;
      next();
    },
    new MyProfilePicUploadService()
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('/upload');

  service.hooks(hooks);
};
