﻿using System;
using System.Windows;

namespace FitCheck_WPFApp
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Create and show main window
            var mainWindow = new MainWindow();
            mainWindow.Show();
        }
    }
}