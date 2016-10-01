require 'rails_helper'
require 'json'

RSpec.describe "create channel, create video", type: :request do
  let(:user)    { create(:user) }
  let(:headers) { user.create_new_auth_token }
  def json
    JSON.parse(response.body, symbolize_names: true)
  end

  it "create channel, create video, get videos, play video, play next video" do
    # create channel
    post channels_path, headers: user.create_new_auth_token,
                        params: { channel: { name: Faker::Name.title } }
    expect(response).to have_http_status(:created)
    expect(Channel.count).to eq 1
    channel_id = json[:id]

    # create video
    youtube_video_id = Faker::Internet.password
    post (channel_videos_path channel_id: channel_id), headers: headers,
                                                       params: { video: { video_id: youtube_video_id } }
    expect(response).to have_http_status(:created)
    expect(Video.count).to eq 1
    video_id = json[:id]

    # get queued videos
    get (queued_channel_videos_path channel_id: channel_id), headers: headers
    expect(response).to have_http_status(:ok)
    expect(json.count).to eq 1
    expect(json.first[:video_id]).to eq youtube_video_id

    # start video
    put (channel_video_path channel_id: channel_id, id: video_id),
        headers: headers, params: { video: { status: 'playing' } }
    expect(response).to have_http_status(:ok)
    expect(Video.all.playing.count).to eq 1

    # get playing video
    get (playing_channel_videos_path channel_id: channel_id), headers: headers
    expect(response).to have_http_status(:ok)
    expect(json[:id]).to eq video_id

    # finish video
    put (channel_video_path channel_id: channel_id, id: video_id),
        headers: headers, params: { video: { status: 'played' } }
    expect(response).to have_http_status(:ok)
    expect(Video.all.played.count).to eq 1

    # get videos
    get (queued_channel_videos_path channel_id: channel_id), headers: headers
    expect(response).to have_http_status(:ok)
    expect(json.count).to eq 0
  end

  it 'cannot play two videos' do
    # create channel
    post channels_path, headers: user.create_new_auth_token,
                        params: { channel: { name: Faker::Name.title } }
    expect(response).to have_http_status(:created)
    expect(Channel.count).to eq 1
    channel_id = json[:id]

    # create video
    first_youtube_video_id = Faker::Internet.password
    post (channel_videos_path channel_id: channel_id), headers: headers,
                                                       params: { video: { video_id: first_youtube_video_id } }
    expect(response).to have_http_status(:created)
    first_video_id = json[:id]

    second_youtube_video_id = Faker::Internet.password
    post (channel_videos_path channel_id: channel_id), headers: headers,
                                                       params: { video: { video_id: second_youtube_video_id } }
    expect(response).to have_http_status(:created)
    second_video_id = json[:id]

    # start video
    put (channel_video_path channel_id: channel_id, id: first_video_id),
        headers: headers, params: { video: { status: 'playing' } }
    expect(response).to have_http_status(:ok)
    
    put (channel_video_path channel_id: channel_id, id: second_video_id),
        headers: headers, params: { video: { status: 'playing' } }
    expect(response).to have_http_status(:unprocessable_entity)

    expect(Video.all.playing.count).to eq 1
  end

  it 'become player' do
    # create channel
    post channels_path, headers: user.create_new_auth_token,
                        params: { channel: { name: Faker::Name.title } }
    expect(response).to have_http_status(:created)
    expect(Channel.count).to eq 1
    channel_id = json[:id]

    # become player
    put (play_channel_path id: channel_id), headers: headers
    expect(Channel.find(channel_id).player_id).to eq user.id

    # only channel member can become player
    another_user = create(:user)
    put (play_channel_path id: channel_id), headers: another_user.create_new_auth_token
    expect(response).to have_http_status(:not_found)
    expect(Channel.find(channel_id).player_id).to eq user.id
  end
end
