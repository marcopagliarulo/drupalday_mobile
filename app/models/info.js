exports.definition = {
	config: {
		columns: {
		    "nid": "INTEGER",
		    "title": "TEXT",
		    "body": "TEXT",
		    "image": "BLOB",
		    "changed": "TEXT",
		    "url" : "TEXT",
		    "type" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "info",
			idAttribute: "nid",
		    db_file: "/drupalday.sqlite",
		    db_name: "main",
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};