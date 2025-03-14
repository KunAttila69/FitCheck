using FitCheck_WPFApp.Services;
using FitCheck_WPFApp.ViewModels;
using FitCheck_WPFApp.Views;
using System.Windows;

namespace FitCheck_WPFApp
{
    public partial class MainWindow : Window
    {
        private readonly ApiService _apiService;
        private readonly LogService _logService;
        private readonly AuthService _authService;

        public MainWindow()
        {
            InitializeComponent();

            // Initialize services
            _apiService = new ApiService();
            _logService = new LogService();
            _authService = new AuthService();

            // Check if user is authenticated
            if (!_authService.IsAuthenticated())
            {
                ShowLoginView();
                return;
            }

            // Navigate to Users view by default
            ShowUsersView();
        }

        private void ShowLoginView()
        {
            var loginView = new LoginView(_authService);
            loginView.LoginSuccessful += (sender, e) => ShowUsersView();
            MainContentFrame.Navigate(loginView);
        }

        private void ShowUsersView()
        {
            var usersViewModel = new UsersViewModel(_apiService, _logService);
            var usersView = new UsersView { DataContext = usersViewModel };
            MainContentFrame.Navigate(usersView);
        }

        private void ShowPostsView()
        {
            var postsViewModel = new PostsViewModel(_apiService, _logService);
            var postsView = new PostsView { DataContext = postsViewModel };
            MainContentFrame.Navigate(postsView);
        }

        private void ShowCommentsView()
        {
            var commentsViewModel = new CommentsViewModel(_apiService, _logService);
            var commentsView = new CommentsView { DataContext = commentsViewModel };
            MainContentFrame.Navigate(commentsView);
        }

        private void ShowLogsView()
        {
            var logsViewModel = new LogsViewModel(_logService);
            var logsView = new LogsView { DataContext = logsViewModel };
            MainContentFrame.Navigate(logsView);
        }

        private void BtnUsers_Click(object sender, RoutedEventArgs e)
        {
            ShowUsersView();
        }

        private void BtnPosts_Click(object sender, RoutedEventArgs e)
        {
            ShowPostsView();
        }

        private void BtnComments_Click(object sender, RoutedEventArgs e)
        {
            ShowCommentsView();
        }

        private void BtnLogs_Click(object sender, RoutedEventArgs e)
        {
            ShowLogsView();
        }

        private void BtnLogout_Click(object sender, RoutedEventArgs e)
        {
            _authService.Logout();
            ShowLoginView();
        }
    }
}