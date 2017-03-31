var Customer = require('../models').Customer;
var scraper = require('scraper');
var _ = require('underscore');

exports.getCustomerById = function(req, res) {
  Customer.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(function(customer) {
    res.json(customer);
  }).catch(function(err) {
    res.json(err);
  });
};

exports.getAllCustomers = function(req, res) {
  Customer.findAll().then(function(cutomeres) {
    res.json(cutomeres);
  }).catch(function(err) {
    res.json(err);
  });
};

exports.syncCustomers = function(req, res) {
  var continents = ['australia','north-america','europe'];
  scraper(continents, function(err, data) {
    var uniqueList = _.uniq(data, function(item, key, a) {
      return item.link;
    });

    var customers = _.map(uniqueList, function(val, key) {
      var email = (!_.isEmpty(val.emails)) ? _.first(val.emails) : null;
      return {
        company_name: val.title,
        company_website: val.link,
        contact_email: email
      }
    });

    Customer.bulkCreate(customers, { ignoreDuplicates: true })
    .spread(function() {
      res.json("Updated");
    })
    .catch(function(errors){
      console.log(errors);
      res.json(errors);
    });
  });
};

exports.createCustomer = function(req, res) {
  Customer.create(req.body).then(function(customer) {
    res.json(customer);
  }).catch(function(err) {
    res.json(err);
  });
};

exports.updateCustomer = function(req, res) {
  Customer.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(customer) {
    customer.update(req.body).then(function(data) {
      res.json(data);
    });
  }).catch(function(err) {
    res.json(err);
  });
};

exports.deleteCustomer = function(req, res) {
  Customer.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(customer) {
    customer.destroy().then(function(data) {
      res.json(data);
    });
  }).catch(function(err) {
    res.json(err);
  });
};
