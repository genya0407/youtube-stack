class Channel < ApplicationRecord
  has_many :user_channels
  has_many :users, through: :user_channels
  has_many :videos
  has_one :player, class_name: 'User', foreign_key: 'player_id'

  validate :player_belongs_to_channel

  private
  def player_belongs_to_channel
    if player_id.present? && !users.exists?(id: player_id)
      errors.add(:player, 'player is not channel member.')
    end
  end
end
