require 'sequel'
DB = Sequel.sqlite('development.sqlite3')

DB.create_table :videos do
  primary_key :id
  String :video_id, null: false
  DateTime :created_at, null: false
  DateTime :played_at
end
