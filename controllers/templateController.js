var Template = require('../models').Template;

exports.getTemplateById = function(req, res) {
  Template.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(function(template) {
    if (!template) {
      res.status(404).json({
        error: 'not found'
      });
    } else {
      res.status(200);
      res.json(template);
    }
  }).catch(function() {
    res.status(400).json({
      error: 'bad request',
      message: err
    });
  });
};

exports.getAllTemplates = function(req, res) {
  Template.findAll()
  .then(function(templates) {
    res.json(templates);
  }).catch(function(err) {
    res.status(400).json({
      error: 'bad request',
      message: err
    });
  });
};

exports.createTemplate = function(req, res) {
  Template.create(req.body).then(function(template) {
    res.json(template);
  }).catch(function(err) {
    res.status(400).json({
      error: err.message,
    });
  });
};

exports.updateTemplate = function(req, res) {
  Template.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(template) {
    template.update(req.body).then(function(data) {
      res.json(data);
    }).catch(function(err) {
        res.status(400).json({
        error: err.message
      });
    });
  }).catch(function(err) {
    res.status(400).json({
      error: 'bad request',
      message: err
    });
  });
};

exports.deleteTemplate = function(req, res) {
  Template.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(template) {
    template.destroy().then(function(data) {
      res.json(data);
    });
  }).catch(function(err) {
    res.status(400).json({
      error: 'bad request',
      message: err
    });
  });
};
