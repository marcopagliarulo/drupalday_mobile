exports.definition = {
	config: {
		columns: {
		    "nid": "INTEGER"
		},
		adapter: {
			type: "sql",
			collection_name: "favorites",
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