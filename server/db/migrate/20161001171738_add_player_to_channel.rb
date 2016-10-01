class AddPlayerToChannel < ActiveRecord::Migration[5.0]
  def change
    add_column :channels, :player_id, :integer
  end
end
