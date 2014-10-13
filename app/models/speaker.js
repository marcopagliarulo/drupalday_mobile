exports.definition = {
	config: {
		columns: {
		    "uid": "INTEGER",
		    "name": "TEXT",
		    "surname": "TEXT",
		    "bio": "TEXT",
		    "avatar": "BLOB"
		},
		adapter: {
			type: "sql",
			collection_name: "speaker",
			idAttribute: "uid",
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