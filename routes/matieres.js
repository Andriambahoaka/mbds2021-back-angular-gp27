let Matiere = require('../model/matiere');



// GETS LIST OF  MATIERE FROM THE DATABASE
function getMatieres(req, res){
    Matiere.find((err, matieres) => {
        if(err){
            res.send(err)
        }

        res.send(matieres);
    });
}

// GETS A SINGLE MATIERE FROM THE DATABASE
function getMatiere(req, res) {
    Matiere.findById(req.params.id, function (err, matiere) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!matiere) return res.status(404).send("No matiere found.");
        res.status(200).send(matiere);
    });
}

module.exports = { getMatieres,getMatiere};