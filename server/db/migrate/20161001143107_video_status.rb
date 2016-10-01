class VideoStatus < ActiveRecord::Migration[5.0]
  def change
    add_column :videos, :status, :integer, null: false, default: 0
  end
end
