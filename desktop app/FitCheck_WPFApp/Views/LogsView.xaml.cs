using FitCheck_WPFApp.Services;
using FitCheck_WPFApp.ViewModels;
using System.Windows.Controls;

namespace FitCheck_WPFApp.Views
{
    public partial class LogsView : UserControl
    {
        public LogsView(LogService logService, AuthService authService)
        {
            InitializeComponent();
            DataContext = new LogsViewModel(logService, authService);
        }
    }
}