using CrmEarlyBound;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;

namespace WebRole1.Controllers
{
    [DataContract]
    public class TestWarningObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public string Name
        {
            get;
            set;
        }

        [DataMember]
        public string Description
        {
            get;
            set;
        }
    }

    public class WarningsController : ApiController
    {
        // GET api/warnings
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from w in ctx.new_warningSet
                        select new CrmEarlyBound.new_warning
                        {
                            Id = w.Id,
                            new_name = w.new_name,
                            new_Description = w.new_Description
                        };

            var queryResults = query.ToList();

            var listReturn = new List<TestWarningObject>();
            foreach (new_warning x in queryResults)
            {
                var returnObject = new TestWarningObject();
                returnObject.Id = x.Id;
                returnObject.Name = x.new_name;
                returnObject.Description = x.new_Description;

                listReturn.Add(returnObject);
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                listReturn);
        }
    }
}
