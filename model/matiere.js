let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MatiereSchema = Schema({
    id: Number,
    matiere: String,
    pathImage: String,
    prof: {
        nomProfesseur: String,
        pathProfesseur: String
    }
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Matiere', MatiereSchema);