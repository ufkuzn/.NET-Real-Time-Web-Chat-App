namespace Test.Models
{
    public class Group
    {
        public string GroupName { get; set; }
        public List<Client> Clients = new List<Client>();
    }
}