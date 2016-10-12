Devise.setup do |config|
  config.mailer_sender = Rails.application.secrets.user_name
end
