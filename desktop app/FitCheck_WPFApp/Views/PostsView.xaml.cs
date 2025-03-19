using FitCheck_WPFApp.Services;
using FitCheck_WPFApp.ViewModels;
using System.Windows.Controls;

namespace FitCheck_WPFApp.Views
{
    public partial class PostsView : UserControl
    {
        public PostsView(ApiService apiService, LogService logService, AuthService authService)
        {
            InitializeComponent();
            DataContext = new PostsViewModel(apiService, logService, authService);
        }
    }
}