using FitCheck_WPFApp.Services;
using FitCheck_WPFApp.ViewModels;
using System.Windows.Controls;

namespace FitCheck_WPFApp.Views
{
    public partial class CommentsView : UserControl
    {
        public CommentsView(ApiService apiService, LogService logService, AuthService authService)
        {
            InitializeComponent();
            DataContext = new CommentsViewModel(apiService, logService, authService);
        }
    }
}