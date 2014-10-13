exports.definition = {
	config: {
		columns: {
		    "nid": "INTEGER",
		    "title": "TEXT",
		    "body": "TEXT",
		    "uid": "INTEGER",
		    "start": "TEXT",
		    "end": "TEXT",
		    "level" : "INTEGER",
		    "category" : "TEXT",
		    "changed": "TEXT",
		    "track" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "talk",
			idAttribute: "nid",
		    db_file: "/drupalday.sqlite",
		    db_name: "main",
		}
	},
};