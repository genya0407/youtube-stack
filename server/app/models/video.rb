class Video < ApplicationRecord
  belongs_to :channel

  validate :playing_should_unique, if: :playing?
  validates :video_id, presence: true

  enum status: { queued: 0, playing: 5, played: 10 }

  private
  def playing_should_unique
    if channel.videos.playing.exists?
      errors.add(:status, 'another video is played now.')
    end
  end
end
