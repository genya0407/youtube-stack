class VideosController < ApplicationController
  before_action :authenticate_user!, :set_user
  before_action :set_channel
  before_action :set_video, only: [:destroy, :update]

  def create
    video = @channel.videos.build(params.require(:video).permit(:video_id))
    if video.save
      render json: video, status: :created
    else
      render json: video.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @video.destroy
      render json: @video, status: :ok
    else
      render json: @video.erros, status: :unprocessable_entity
    end
  end

  def update
    @video.status = update_params.to_h['status'].to_sym
    if @video.save
      render json: @video, status: :ok
    else
      render json: @video.errors, status: :unprocessable_entity
    end
  end

  def queued
    render json: @channel.videos.queued
  end

  def playing
    render json: @channel.videos.playing.first
  end

  private
  def set_channel
    @channel = @user.channels.find_by(id: params[:channel_id])
    if @channel.nil?
      render json: { error: 'no such channel.' }, status: :not_found
    end
  end

  def set_video
    @video = @channel.videos.find_by(id: params[:id])
    if @video.nil?
      render json: { error: 'no such video.' }, status: :not_found
    end
  end

  def update_params
    params.require(:video)
          .permit(:status)
  end
end
