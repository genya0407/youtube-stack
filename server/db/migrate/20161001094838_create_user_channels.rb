class CreateUserChannels < ActiveRecord::Migration[5.0]
  def change
    create_table :user_channels do |t|
      t.references :user
      t.references :channel

      t.timestamps
    end
  end
end
