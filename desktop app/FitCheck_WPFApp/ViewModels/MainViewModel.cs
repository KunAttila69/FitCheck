using FitCheck_WPFApp.Services;
using System.Windows.Input;

namespace FitCheck_WPFApp.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private readonly ApiService _apiService;
        private readonly LogService _logService;
        private readonly AuthService _authService;

        private ViewModelBase _currentViewModel;
        public ViewModelBase CurrentViewModel
        {
            get => _currentViewModel;
            set => SetProperty(ref _currentViewModel, value);
        }

        public ICommand UsersCommand { get; }
        public ICommand PostsCommand { get; }
        public ICommand CommentsCommand { get; }
        public ICommand LogsCommand { get; }
        public ICommand LogoutCommand { get; }

        public MainViewModel(ApiService apiService, LogService logService, AuthService authService)
        {
            _apiService = apiService;
            _logService = logService;
            _authService = authService;

            UsersCommand = new RelayCommand(param => NavigateToUsers());
            PostsCommand = new RelayCommand(param => NavigateToPosts());
            CommentsCommand = new RelayCommand(param => NavigateToComments());
            LogsCommand = new RelayCommand(param => NavigateToLogs());
            LogoutCommand = new RelayCommand(param => Logout());

            // Set default view
            NavigateToUsers();
        }

        private void NavigateToUsers()
        {
            CurrentViewModel = new UsersViewModel(_apiService, _logService);
        }

        private void NavigateToPosts()
        {
            CurrentViewModel = new PostsViewModel(_apiService, _logService);
        }

        private void NavigateToComments()
        {
            CurrentViewModel = new CommentsViewModel(_apiService, _logService);
        }

        private void NavigateToLogs()
        {
            CurrentViewModel = new LogsViewModel(_logService);
        }

        private void Logout()
        {
            _authService.Logout();
            // Here you would typically navigate to login view or close the application
        }
    }
}