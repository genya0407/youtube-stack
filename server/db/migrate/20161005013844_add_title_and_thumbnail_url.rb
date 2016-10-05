class AddTitleAndThumbnailUrl < ActiveRecord::Migration[5.0]
  def change
    add_column :videos, :title, :string, null: false, default: ''
    add_column :videos, :thumbnail_url, :string, null: false, default: ''
  end
end
