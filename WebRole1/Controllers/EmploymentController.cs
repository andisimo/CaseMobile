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
    public class EmploymentObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? BeginDate
        {
            get;
            set;
        }

        [DataMember]
        public Guid ContactId
        {
            get;
            set;
        }

        [DataMember]
        public string Employer
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? EndDate
        {
            get;
            set;
        }

        [DataMember]
        public string Position
        {
            get;
            set;
        }

        [DataMember]
        public string ReasonForLeaving
        {
            get;
            set;
        }
    }

    public class EmploymentController : ApiController
    {
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse("Url=https://childsafety.crm.dynamics.com; Username=; Password=");
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from e in ctx.new_employmentSet
                        select new EmploymentObject
                        {
                            Id = e.Id,
                            BeginDate = e.new_BeginDate,
                            ContactId = e.new_ContactEmploymentId.Id,
                            Employer = e.new_employer,
                            EndDate = e.new_EndDate,
                            Position = e.new_Position,
                            ReasonForLeaving = e.new_ReasonForLeaving
                        };

            var queryResults = query.ToList();

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                queryResults);
        }
    }
}
