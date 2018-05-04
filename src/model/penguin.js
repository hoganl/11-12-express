'use strict';

import mongoose from 'mongoose';

const penguinSchema = mongoose.Schema({
  species: {
    type: String,
    required: true,    
  },  
  firstName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minlength: 10,
  },
  gender: {
    type: String,
  },
});

export default mongoose.model('penguin', penguinSchema);
