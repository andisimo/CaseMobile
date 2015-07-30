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
    public class AttendanceObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public string RecordNumber
        {
            get;
            set;
        }

        [DataMember]
        public int? AttendanceScore
        {
            get;
            set;
        }

        [DataMember]
        public string AttendanceScoreString
        {
            get;
            set;
        }
       
        [DataMember]
        public DateTime? Date
        {
            get;
            set;
        }
    }

    public class AttendanceController : ApiController
    {
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from a in ctx.new_attendanceSet
                        select new AttendanceObject
                        {
                            Id = a.Id,
                            RecordNumber = a.new_recordno,
                            AttendanceScore = a.new_Attendance,
                            Date = a.new_Date
                        };

            var queryResults = query.ToList();

            foreach (AttendanceObject a in queryResults)
            {
                switch (a.AttendanceScore)
                {
                    case 100000000:
                        a.AttendanceScoreString = "Present";
                        break;
                    case 100000001:
                        a.AttendanceScoreString = "Absent";
                        break;
                    case 100000002:
                        a.AttendanceScoreString = "Arrived to School Late";
                        break;
                    case 100000003:
                        a.AttendanceScoreString = "Left School Early";
                        break;
                }
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                queryResults);
        }
    }
}
