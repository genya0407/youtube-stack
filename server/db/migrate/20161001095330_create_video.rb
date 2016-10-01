class CreateVideo < ActiveRecord::Migration[5.0]
  def change
    create_table :videos do |t|
      t.references :channel
      t.string :video_id

      t.timestamps
    end
  end
end
