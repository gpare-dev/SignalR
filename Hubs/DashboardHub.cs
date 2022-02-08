using Microsoft.AspNetCore.SignalR;

namespace SignalR.Hubs
{
    public class DashboardHub : Hub
    {
        public async Task AddTask(string text, string categoryCard, int taskNumber) 
        {
            await Clients.All.SendAsync("AddTask", text, categoryCard, taskNumber);
        }

        public async Task EditTask(int taskID, string text)
        {
            await Clients.All.SendAsync("EditTask", taskID, text);
        }

        public async Task MoveTask(int taskID, string categoryCard) 
        {
            await Clients.All.SendAsync("MoveTask", taskID, categoryCard);
        }

        public async Task DeleteTask(int taskID) 
        {
            await Clients.All.SendAsync("DeleteTask", taskID);
        }
    }
}
