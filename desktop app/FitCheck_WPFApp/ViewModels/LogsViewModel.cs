using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
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

        public bool HasLogs => Logs != null && Logs.Count > 0;

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
        public ICommand ExportLogsCommand { get; }

        public LogsViewModel(LogService logService, AuthService authService)
        {
            _logService = logService;
            _authService = authService;
            _logs = new ObservableCollection<AdminLog>();

            RefreshCommand = new RelayCommand(async param => await LoadLogsAsync());
            ExportLogsCommand = new RelayCommand(async param => await ExportLogsAsync());

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
                OnPropertyChanged(nameof(HasLogs)); 
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading logs: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
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
                Task.Run(LoadLogsAsync);
                return;
            }

            var searchLower = SearchQuery.ToLower();
            var allLogs = _logService.GetLogs(); 

            var dateFilteredLogs = allLogs
                .Where(l => l.Timestamp >= StartDate && l.Timestamp <= EndDate.AddDays(1));

            var filteredLogs = new ObservableCollection<AdminLog>(
                dateFilteredLogs.Where(log =>
                    (log.AdminUsername != null && log.AdminUsername.ToLower().Contains(searchLower)) ||
                    (log.Description != null && log.Description.ToLower().Contains(searchLower)) ||
                    (log.TargetId != null && log.TargetId.ToLower().Contains(searchLower)) ||
                    log.ActionType.ToString().ToLower().Contains(searchLower)
                ).OrderByDescending(l => l.Timestamp)
            );

            Logs = filteredLogs;
            OnPropertyChanged(nameof(HasLogs)); 
        }

        private async Task ExportLogsAsync()
        {
            try
            {
                var saveFileDialog = new Microsoft.Win32.SaveFileDialog
                {
                    Filter = "CSV files (*.csv)|*.csv|All files (*.*)|*.*",
                    DefaultExt = "csv",
                    FileName = $"FitCheck_AdminLogs_{DateTime.Now:yyyy-MM-dd}"
                };

                if (saveFileDialog.ShowDialog() == true)
                {
                    await Task.Run(() =>
                    {
                        using (var writer = new StreamWriter(saveFileDialog.FileName))
                        {
                            writer.WriteLine("ID;Timestamp;AdminUsername;ActionType;TargetId;Description");

                            foreach (var log in Logs)
                            {
                                writer.WriteLine($"{log.Id};{log.Timestamp:yyyy-MM-dd HH:mm:ss};\"{log.AdminUsername}\";{log.ActionType};\"{log.TargetId}\";\"{log.Description.Replace("\"", "\"\"")}\"");
                            }
                        }
                    });

                    MessageBox.Show($"Logs successfully exported to {saveFileDialog.FileName}", "Export Complete", MessageBoxButton.OK, MessageBoxImage.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error exporting logs: {ex.Message}", "Export Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}