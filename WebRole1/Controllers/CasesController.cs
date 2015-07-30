using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Client;
using CrmEarlyBound;
using Microsoft.Xrm.Client.Services;
using System.Runtime.Serialization;

namespace WebRole1.Controllers
{
    [DataContract]
    public class TestCaseObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public string Title
        {
            get;
            set;
        }

        [DataMember]
        public string AllegationType
        {
            get;
            set;
        }

        [DataMember]
        public string Allegation
        {
            get;
            set;
        }

        [DataMember]
        public CrmEntityReference Reporter
        {
            get;
            set;
        }
    }

    public class CasesController : ApiController
    {
        // GET api/home
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from c in ctx.IncidentSet
                        select new CrmEarlyBound.Incident
                        {
                           Id = c.Id,
                           Title = c.Title,
                           new_AllegationType = c.new_AllegationType,
                           new_Allegation = c.new_Allegation, 
                           new_Reporter = c.new_Reporter
                        };
            
            var cases = query.ToList();

            var listReturn = new List<TestCaseObject>(); 
            foreach (Incident c in cases)
            {
                var caseObject = new TestCaseObject(); 
                caseObject.Id = c.Id;
                caseObject.Title = c.Title; 
                caseObject.Allegation = c.new_Allegation;
                caseObject.Reporter = c.new_Reporter;
                
                switch (c.new_AllegationType)
                {
                    case 100000000:
                        caseObject.AllegationType = "Abuse";
                        break;
                    case 100000001:
                        caseObject.AllegationType = "Truancy";
                        break;
                    case 100000002:
                        caseObject.AllegationType = "Neglect";
                        break;
                }

                listReturn.Add(caseObject);
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                listReturn);
        }

        // GET api/home/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/home
        public void Post([FromBody]string value)
        {
        }

        // PUT api/home/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/home/5
        public void Delete(int id)
        {
        }
    }
}
