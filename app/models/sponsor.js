exports.definition = {
	config: {
		columns: {
		    "nid": "INTEGER",
		    "title": "TEXT",
		    "image": "BLOB",
		    "website": "TEXT",
		    "type": "INTEGER",
		    "changed" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "sponsor",
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