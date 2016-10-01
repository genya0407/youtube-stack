Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  
  resources :channels, except: [:show] do
    member { put :play }
    member { put :go_next }
    resources :videos, except: [:show, :index] do
      collection { get :playing }
      collection { get :queued }
    end
  end
end
