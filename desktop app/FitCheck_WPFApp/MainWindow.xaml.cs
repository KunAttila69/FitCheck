using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using FitCheck_WPFApp.Views;
using System;
using System.Windows;
using System.Windows.Controls;

namespace FitCheck_WPFApp
{
    public partial class MainWindow : Window
    {
        private readonly AuthService _authService;
        private readonly ApiService _apiService;
        private readonly LogService _logService;

        private UsersView _usersView;
        private PostsView _postsView;
        private CommentsView _commentsView;
        private LogsView _logsView;
        private LoginView _loginView;

        public MainWindow()
        {
            InitializeComponent();

            _authService = new AuthService();
            _apiService = new ApiService();
            _logService = new LogService();

            _loginView = new LoginView(_authService);
            _loginView.LoginSuccessful += OnLoginSuccessful;

            ContentPanel.Content = _loginView;
        }

        private async void OnLoginSuccessful(object sender, EventArgs e)
        {
            _apiService.SetAuthToken(_authService.GetAccessToken());

            if (_authService.IsAdmin())
            {
                AdminNavigation.Visibility = Visibility.Visible;

                InitializeAdminViews();

                ContentPanel.Content = _usersView;
            }
            else
            {
                MessageBox.Show("You don't have administrator privileges for this application.",
                    "Access Denied", MessageBoxButton.OK, MessageBoxImage.Warning);

                await _logService.LogActionAsync(
                    AdminActionType.UnauthorizedAccess,
                    "unknown",
                    _authService.GetCurrentUsername(),
                    "N/A",
                    $"Unauthorized access attempt by {_authService.GetCurrentUsername()}"
                );

                return;
            }
        }

        private void InitializeAdminViews()
        {
            _usersView = _usersView ?? new UsersView(_apiService, _logService, _authService);
            _postsView = _postsView ?? new PostsView(_apiService, _logService, _authService);
            _commentsView = _commentsView ?? new CommentsView(_apiService, _logService, _authService);
            _logsView = _logsView ?? new LogsView(_logService, _authService);
        }

        private void UsersButton_Click(object sender, RoutedEventArgs e)
        {
            ContentPanel.Content = _usersView;
        }

        private void PostsButton_Click(object sender, RoutedEventArgs e)
        {
            ContentPanel.Content = _postsView;
        }

        private void CommentsButton_Click(object sender, RoutedEventArgs e)
        {
            ContentPanel.Content = _commentsView;
        }

        private void LogsButton_Click(object sender, RoutedEventArgs e)
        {
            ContentPanel.Content = _logsView;
        }

        private void LogoutButton_Click(object sender, RoutedEventArgs e)
        {
            _authService.Logout();

            AdminNavigation.Visibility = Visibility.Collapsed;

            ContentPanel.Content = _loginView;
        }
    }
}