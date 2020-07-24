using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Buro.Startup))]
namespace Buro
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
