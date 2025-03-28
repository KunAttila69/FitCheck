using FitCheck_WPFApp.Services;
using FitCheck_WPFApp.ViewModels;
using System.Windows.Controls;

namespace FitCheck_WPFApp.Views
{
    public partial class UsersView : UserControl
    {
        public UsersView(ApiService apiService, LogService logService, AuthService authService)
        {
            InitializeComponent();
            DataContext = new UsersViewModel(apiService, logService, authService);
        }
    }
}