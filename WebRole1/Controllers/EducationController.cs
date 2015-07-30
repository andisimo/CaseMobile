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
    public class EducationObject
    {
        [DataMember]
        public Guid Id
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
        public DateTime? EnrollmentDate
        {
            get;
            set;
        }

        [DataMember]
        public int? Grade
        {
            get;
            set;
        }

        [DataMember]
        public bool? GradeRepeat
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
    }

    public class EducationController : ApiController
    {
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from e in ctx.new_educationSet
                        select new EducationObject
                        {
                            Id = e.Id,
                            Name = e.new_name, 
                            ContactId = e.new_ContactEducationId.Id, 
                            EnrollmentDate = e.new_EnrollmentDate, 
                            Grade = e.new_Grade, 
                            GradeRepeat = e.new_GradeRepeat
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
