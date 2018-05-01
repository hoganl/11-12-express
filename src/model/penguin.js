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
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
});

export default mongoose.model('penguin', penguinSchema);
