class ChannelsController < ApplicationController
  before_action :authenticate_user!, :set_user
  before_action :set_channel, only: [:destroy, :update, :play, :go_next]

  def index
    render json: @user.channels
  end

  def update
    if @channel.update(channel_params)
      render json: @channel
    else
      render json: @channel.errors, status: :unprocessable_entity
    end
  end

  def create
    channel = @user.channels.build(channel_params)
    if @user.save
      render json: channel, status: :created
    else
      render json: channel.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @channel.destroy
      render json: @channel
    else
      render json: @channel.errors, status: :unprocessable_entity
    end
  end

  def play
    if @channel.update(player_id: @user.id)
      render json: @channel
    else
      render json: @channel.errors, status: :unprocessable_entity
    end
  end
  
  def go_next
    render json: @channel.go_next
  end

  private
  def set_channel
    @channel = @user.channels.find_by(id: params[:id])
    if @channel.nil?
      render json: { error: 'no such channel.' }, status: :not_found
    end
  end

  def channel_params
    params.require(:channel)
          .permit(:name)
  end
end
