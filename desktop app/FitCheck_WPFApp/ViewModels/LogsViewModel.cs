using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.ObjectModel;
using System.Linq;

namespace FitCheck_WPFApp.ViewModels
{
    public class LogsViewModel : ViewModelBase
    {
        private readonly LogService _logService;

        private ObservableCollection<AdminLog> _logs;
        public ObservableCollection<AdminLog> Logs
        {
            get => _logs;
            set => SetProperty(ref _logs, value);
        }

        private bool _hasLogs;
        public bool HasLogs
        {
            get => _hasLogs;
            set => SetProperty(ref _hasLogs, value);
        }

        public LogsViewModel(LogService logService)
        {
            _logService = logService;
            LoadLogs();
        }

        private void LoadLogs()
        {
            var logsList = _logService.GetLogs();
            Logs = new ObservableCollection<AdminLog>(logsList);
            HasLogs = Logs.Any();
        }
    }
}