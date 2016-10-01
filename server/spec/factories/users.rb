FactoryGirl.define do
  factory :user do
    pass = Faker::Internet.password
    email                 { Faker::Internet.email }
    password              pass
    password_confirmation pass

    after :build do |user|
      user.skip_confirmation!
    end
  end
end
