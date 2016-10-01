class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  private
  def set_user
    @user = current_user
  end
end
