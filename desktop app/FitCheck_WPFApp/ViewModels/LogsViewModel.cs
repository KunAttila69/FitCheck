using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace FitCheck_WPFApp.ViewModels
{
    public class LogsViewModel : ViewModelBase
    {
        private readonly LogService _logService;
        private readonly AuthService _authService;

        private ObservableCollection<AdminLog> _logs;
        public ObservableCollection<AdminLog> Logs
        {
            get => _logs;
            set => SetProperty(ref _logs, value);
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            set => SetProperty(ref _isLoading, value);
        }

        private string _searchQuery;
        public string SearchQuery
        {
            get => _searchQuery;
            set
            {
                if (SetProperty(ref _searchQuery, value))
                {
                    FilterLogs();
                }
            }
        }

        private DateTime _startDate = DateTime.Now.AddDays(-30);
        public DateTime StartDate
        {
            get => _startDate;
            set
            {
                if (SetProperty(ref _startDate, value))
                {
                    Task.Run(LoadLogsAsync);
                }
            }
        }

        private DateTime _endDate = DateTime.Now;
        public DateTime EndDate
        {
            get => _endDate;
            set
            {
                if (SetProperty(ref _endDate, value))
                {
                    Task.Run(LoadLogsAsync);
                }
            }
        }

        public ICommand RefreshCommand { get; }

        public LogsViewModel(LogService logService, AuthService authService)
        {
            _logService = logService;
            _authService = authService;
            _logs = new ObservableCollection<AdminLog>();

            RefreshCommand = new RelayCommand(async param => await LoadLogsAsync());

            Task.Run(LoadLogsAsync);
        }

        private async Task LoadLogsAsync()
        {
            if (!_authService.IsAdmin())
            {
                MessageBox.Show("You do not have permission to view logs.", "Access Denied", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            IsLoading = true;
            try
            {
                var logs = await _logService.GetLogsAsync(StartDate, EndDate);
                Logs = new ObservableCollection<AdminLog>(logs);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                IsLoading = false;
            }
        }

        private void FilterLogs()
        {
            if (string.IsNullOrWhiteSpace(SearchQuery))
            {
                // If search query is empty, reload logs
                Task.Run(LoadLogsAsync);
                return;
            }

            // Filter in-memory
            var searchLower = SearchQuery.ToLower();
            var filteredLogs = new ObservableCollection<AdminLog>();

            foreach (var log in Logs)
            {
                if ((log.AdminUsername != null && log.AdminUsername.ToLower().Contains(searchLower)) ||
                    (log.Description != null && log.Description.ToLower().Contains(searchLower)) ||
                    (log.TargetId != null && log.TargetId.ToLower().Contains(searchLower)))
                {
                    filteredLogs.Add(log);
                }
            }

            Logs = filteredLogs;
        }
    }
}